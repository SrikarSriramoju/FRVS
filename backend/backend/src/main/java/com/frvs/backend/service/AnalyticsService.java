package com.frvs.backend.service;

import com.frvs.backend.dto.AnalyticsSummaryDto;
import com.frvs.backend.dto.FeatureClusterDto;
import com.frvs.backend.dto.RawFeatureRequestDto;
import com.frvs.backend.dto.SentimentScoreDto;
import com.frvs.backend.entity.FeatureCluster;
import com.frvs.backend.entity.FeatureRequest;
import com.frvs.backend.entity.FeatureStatus;
import com.frvs.backend.entity.SentimentLabel;
import com.frvs.backend.entity.SentimentScore;
import com.frvs.backend.repository.FeatureClusterRepository;
import com.frvs.backend.repository.FeatureRequestRepository;
import com.frvs.backend.repository.CommentRepository;
import com.frvs.backend.repository.SentimentScoreRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.ListItem;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.Table;
import com.lowagie.text.Cell;
import com.lowagie.text.PageSize;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final FeatureClusterRepository clusterRepository;
    private final FeatureRequestRepository featureRepository;
    private final CommentRepository commentRepository;
    private final SentimentScoreRepository sentimentRepository;

    public AnalyticsService(FeatureClusterRepository clusterRepository, 
                            FeatureRequestRepository featureRepository,
                            CommentRepository commentRepository,
                            SentimentScoreRepository sentimentRepository) {
        this.clusterRepository = clusterRepository;
        this.featureRepository = featureRepository;
        this.commentRepository = commentRepository;
        this.sentimentRepository = sentimentRepository;
    }

    public AnalyticsSummaryDto getSummary(String productKey) {
        List<FeatureRequest> features = featureRepository.findByProductKeyOrderByCreatedAtDesc(productKey);
        List<FeatureCluster> clusters = clusterRepository.findByProductKey(productKey);

        long totalFeatures = features.size();
        long totalClusters = clusters.size();

        List<String> featureIds = features.stream().map(FeatureRequest::getId).toList();
        long totalComments = featureIds.isEmpty() ? 0 : commentRepository.countByFeatureIdIn(featureIds);

        long featureVotes = featureRepository.sumVotesByProductKey(productKey);
        long commentVotes = featureIds.isEmpty() ? 0 : commentRepository.sumVotesByFeatureIds(featureIds);
        long totalVotes = featureVotes + commentVotes;
        
        long openFeatures = clusters.stream().filter(c -> c.getStatus() == FeatureStatus.OPEN).count();
        long todoFeatures = clusters.stream().filter(c -> c.getStatus() == FeatureStatus.TODO).count();
        long inProgressFeatures = clusters.stream().filter(c -> c.getStatus() == FeatureStatus.IN_PROGRESS).count();
        long completedFeatures = clusters.stream().filter(c -> c.getStatus() == FeatureStatus.COMPLETED).count();

        double avgSentimentScore = computeAvgPositiveSentiment(clusters);
        
        Map<String, Integer> upvotesByClusterId = features.stream()
            .filter(f -> f.getCluster() != null)
            .collect(Collectors.groupingBy(f -> f.getCluster().getId(), Collectors.summingInt(FeatureRequest::getUpvotes)));

        String topRequestedCluster = clusters.stream()
            .max((a, b) -> Integer.compare(
                upvotesByClusterId.getOrDefault(a.getId(), 0),
                upvotesByClusterId.getOrDefault(b.getId(), 0)
            ))
            .map(FeatureCluster::getSummarizedTitle)
            .orElse("N/A");

        return AnalyticsSummaryDto.builder()
                .totalFeatures(totalFeatures)
                .totalClusters(totalClusters)
                .totalVotes(totalVotes)
                .totalComments(totalComments)
                .openFeatures(openFeatures)
                .todoFeatures(todoFeatures)
                .inProgressFeatures(inProgressFeatures)
                .completedFeatures(completedFeatures)
            .avgSentimentScore(avgSentimentScore)
                .topRequestedCluster(topRequestedCluster)
                .build();
    }
    
        public List<FeatureClusterDto> getClusters(String productKey) {
        List<FeatureCluster> clusters = clusterRepository.findByProductKey(productKey);
        if (clusters.isEmpty()) {
            return Collections.emptyList();
        }

        // Load all raw feature requests for this tenant once, then group by clusterId.
        List<FeatureRequest> features = featureRepository.findByProductKeyOrderByCreatedAtDesc(productKey);
        Map<String, List<FeatureRequest>> featuresByClusterId = features.stream()
            .filter(f -> f.getCluster() != null)
            .collect(Collectors.groupingBy(f -> f.getCluster().getId()));

        List<String> clusterIds = clusters.stream().map(FeatureCluster::getId).toList();
        Map<String, List<SentimentScore>> sentimentByClusterId = sentimentRepository.findByClusterIdIn(clusterIds)
            .stream()
            .filter(s -> s.getClusterId() != null)
            .collect(Collectors.groupingBy(SentimentScore::getClusterId));

        return clusters.stream()
            .map(c -> toClusterDto(c, featuresByClusterId.getOrDefault(c.getId(), List.of()),
                sentimentByClusterId.getOrDefault(c.getId(), List.of())))
            .sorted((a, b) -> Integer.compare(b.getUpvotes(), a.getUpvotes()))
            .collect(Collectors.toList());
    }

    public byte[] generatePdfReport(String productKey, List<String> selectedClusterIds) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();
            
            AnalyticsSummaryDto summary = getSummary(productKey);
            List<FeatureClusterDto> allClusters = getClusters(productKey);
            Set<String> selectedIds = selectedClusterIds == null ? Set.of() : new HashSet<>(selectedClusterIds);
            List<FeatureClusterDto> reportClusters = selectedIds.isEmpty()
                    ? allClusters
                    : allClusters.stream().filter(cluster -> selectedIds.contains(cluster.getId())).collect(Collectors.toList());
            if (reportClusters.isEmpty()) {
                reportClusters = allClusters;
            }

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Font headingFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 8);

            Paragraph title = new Paragraph("FRVS Analytics Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("Summarized feature demand grouped by AI clusters", bodyFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);
            document.add(new Paragraph(" "));

            Table summaryTable = new Table(4);
            summaryTable.setWidth(100);
            summaryTable.setBorder(Rectangle.NO_BORDER);
            summaryTable.setPadding(6);
            summaryTable.addCell(summaryCell("Total Clusters", String.valueOf(summary.getTotalClusters()), headingFont, bodyFont));
            summaryTable.addCell(summaryCell("Raw Requests", String.valueOf(summary.getTotalFeatures()), headingFont, bodyFont));
            summaryTable.addCell(summaryCell("Total Votes", String.valueOf(summary.getTotalVotes()), headingFont, bodyFont));
            summaryTable.addCell(summaryCell("Positive Sentiment", Math.round(summary.getAvgSentimentScore() * 100) + "%", headingFont, bodyFont));
            document.add(summaryTable);

            document.add(new Paragraph(" "));
            document.add(sectionHeader("Cluster Analysis", headingFont));

            int index = 1;
            for (FeatureClusterDto cluster : reportClusters) {
                Table clusterTable = new Table(2);
                clusterTable.setWidth(100);
                clusterTable.setBorder(Rectangle.BOX);
                clusterTable.setBorderWidth(0.5f);
                clusterTable.setPadding(6);

                clusterTable.addCell(headerCell(index + ". " + cluster.getSummarizedTitle(), headingFont));
                clusterTable.addCell(bodyCell(cluster.getStatus().name().replace("_", " "), bodyFont));
                clusterTable.addCell(bodyCell("Requests: " + cluster.getTotalRequests(), bodyFont));
                clusterTable.addCell(bodyCell("Votes: " + cluster.getUpvotes() + " up / " + cluster.getDownvotes() + " down", bodyFont));
                clusterTable.addCell(bodyCell("Sentiment: " + cluster.getSentimentScore().getOverall(), bodyFont));
                clusterTable.addCell(bodyCell("Tags: " + String.join(", ", cluster.getTags()), bodyFont));
                clusterTable.addCell(bodyCell("Summary: " + cluster.getSummarizedDescription(), bodyFont));

                String rawRequests = cluster.getRelatedFeatures().stream()
                        .limit(4)
                        .map(feature -> "- " + feature.getTitle() + " (" + feature.getUpvotes() + " upvotes)")
                        .collect(Collectors.joining("\n"));
                clusterTable.addCell(bodyCell("Top Raw Requests", bodyFont));
                clusterTable.addCell(bodyCell(rawRequests.isBlank() ? "- None" : rawRequests, smallFont));

                document.add(clusterTable);
                document.add(new Paragraph(" "));
                index++;
            }

            document.add(sectionHeader("Recommendations", headingFont));
            document.add(new Paragraph("1. Keep the roadmap centered on the summarized clusters with the highest vote volume and request count.", bodyFont));
            document.add(new Paragraph("2. Review clusters with low sentiment to determine whether the summary should be split or the underlying request set needs reclassification.", bodyFont));
            document.add(new Paragraph("3. Compare the raw request samples against the summary before making roadmap decisions.", bodyFont));
            document.add(new Paragraph("4. The report reflects selected clusters when provided from the preview panel, so downloads match what the developer chose to review.", bodyFont));

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Generated by FRVS Platform", smallFont));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    public byte[] generatePdfReport(String productKey) {
        return generatePdfReport(productKey, List.of());
    }

    private double computeAvgPositiveSentiment(List<FeatureCluster> clusters) {
        if (clusters == null || clusters.isEmpty()) {
            return 0.0;
        }
        List<String> clusterIds = clusters.stream().map(FeatureCluster::getId).toList();
        if (clusterIds.isEmpty()) {
            return 0.0;
        }

        List<SentimentScore> scores = sentimentRepository.findByClusterIdIn(clusterIds);
        if (scores == null || scores.isEmpty()) {
            return 0.0;
        }

        long total = scores.stream().filter(s -> s.getOverall() != null).count();
        if (total == 0) {
            return 0.0;
        }
        long positive = scores.stream().filter(s -> SentimentLabel.POSITIVE.equals(s.getOverall())).count();
        return (double) positive / (double) total;
    }

    private FeatureClusterDto toClusterDto(FeatureCluster cluster,
                                          List<FeatureRequest> clusterFeatures,
                                          List<SentimentScore> sentimentScores) {
        int totalRequests = clusterFeatures == null ? 0 : clusterFeatures.size();
        int upvotes = clusterFeatures == null ? 0 : clusterFeatures.stream().mapToInt(FeatureRequest::getUpvotes).sum();
        int downvotes = clusterFeatures == null ? 0 : clusterFeatures.stream().mapToInt(FeatureRequest::getDownvotes).sum();

        SentimentScoreDto sentimentScore = aggregateSentiment(sentimentScores);

        List<RawFeatureRequestDto> relatedFeatures = (clusterFeatures == null ? List.<FeatureRequest>of() : clusterFeatures)
                .stream()
                .sorted((a, b) -> Integer.compare(b.getUpvotes(), a.getUpvotes()))
                .map(this::toRawFeatureDto)
                .collect(Collectors.toList());

        List<String> tags = cluster.getTags() == null ? List.of() : cluster.getTags();

        return FeatureClusterDto.builder()
                .id(cluster.getId())
                .summarizedTitle(cluster.getSummarizedTitle())
                .summarizedDescription(cluster.getSummarizedDescription())
                .productKey(cluster.getProductKey())
                .status(cluster.getStatus())
                .totalRequests(totalRequests)
                .upvotes(upvotes)
                .downvotes(downvotes)
                .sentimentScore(sentimentScore)
                .relatedFeatures(relatedFeatures)
                .createdAt(cluster.getCreatedAt())
                .tags(tags)
                .build();
    }

    private RawFeatureRequestDto toRawFeatureDto(FeatureRequest f) {
        return RawFeatureRequestDto.builder()
                .id(f.getId())
                .title(f.getTitle())
                .description(f.getDescription())
                .userId(f.getUserId())
                .userName(f.getUserName())
                .userEmail(f.getUserEmail())
                .productKey(f.getProductKey())
                .createdAt(f.getCreatedAt())
                .upvotes(f.getUpvotes())
                .downvotes(f.getDownvotes())
                .commentCount(f.getCommentCount())
                .status(f.getStatus())
                .clusterId(f.getCluster() != null ? f.getCluster().getId() : null)
                .build();
    }

    private SentimentScoreDto aggregateSentiment(List<SentimentScore> scores) {
        if (scores == null || scores.isEmpty()) {
            return SentimentScoreDto.builder()
                    .positive(0.0)
                    .neutral(1.0)
                    .negative(0.0)
                    .overall(SentimentLabel.NEUTRAL)
                    .build();
        }

        long total = scores.stream().filter(s -> s.getOverall() != null).count();
        if (total == 0) {
            return SentimentScoreDto.builder()
                    .positive(0.0)
                    .neutral(1.0)
                    .negative(0.0)
                    .overall(SentimentLabel.NEUTRAL)
                    .build();
        }

        long pos = scores.stream().filter(s -> SentimentLabel.POSITIVE.equals(s.getOverall())).count();
        long neu = scores.stream().filter(s -> SentimentLabel.NEUTRAL.equals(s.getOverall())).count();
        long neg = scores.stream().filter(s -> SentimentLabel.NEGATIVE.equals(s.getOverall())).count();

        double positive = (double) pos / (double) total;
        double neutral = (double) neu / (double) total;
        double negative = (double) neg / (double) total;

        SentimentLabel overall = SentimentLabel.NEUTRAL;
        if (positive >= neutral && positive >= negative) overall = SentimentLabel.POSITIVE;
        else if (negative >= neutral && negative >= positive) overall = SentimentLabel.NEGATIVE;

        return SentimentScoreDto.builder()
                .positive(positive)
                .neutral(neutral)
                .negative(negative)
                .overall(overall)
                .build();
    }

    private Cell summaryCell(String label, String value, Font headingFont, Font bodyFont) {
        Cell cell = new Cell();
        cell.setBorder(Rectangle.BOX);
        cell.setBorderWidth(0.5f);
        cell.add(new Paragraph(label, headingFont));
        cell.add(new Paragraph(value, bodyFont));
        return cell;
    }

    private Paragraph sectionHeader(String text, Font font) {
        Paragraph paragraph = new Paragraph(text, font);
        paragraph.setSpacingAfter(8);
        return paragraph;
    }

    private Cell headerCell(String text, Font font) {
        Cell cell = new Cell();
        cell.setHeader(true);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.add(new Paragraph(text, font));
        return cell;
    }

    private Cell bodyCell(String text, Font font) {
        Cell cell = new Cell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.add(new Paragraph(text, font));
        return cell;
    }
}
