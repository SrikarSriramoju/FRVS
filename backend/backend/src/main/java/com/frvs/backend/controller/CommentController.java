package com.frvs.backend.controller;

import com.frvs.backend.dto.CommentDto;
import com.frvs.backend.entity.AppUser;
import com.frvs.backend.entity.Comment;
import com.frvs.backend.entity.VoteType;
import com.frvs.backend.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@RequestParam String featureId, @AuthenticationPrincipal AppUser user) {
        return ResponseEntity.ok(commentService.getComments(featureId, user));
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody CommentDto dto, @AuthenticationPrincipal AppUser user) {
        return ResponseEntity.ok(commentService.createComment(dto, user));
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<Comment> voteComment(@PathVariable String id, @RequestParam String type, @AuthenticationPrincipal AppUser user) {
        return ResponseEntity.ok(commentService.voteComment(id, user, VoteType.valueOf(type.toUpperCase())));
    }
}
