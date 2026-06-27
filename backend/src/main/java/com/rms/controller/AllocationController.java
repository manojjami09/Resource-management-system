package com.rms.controller;

import com.rms.dto.AllocationDto;
import com.rms.service.AllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
public class AllocationController {

    @Autowired
    private AllocationService allocationService;

    @GetMapping
    public ResponseEntity<List<AllocationDto>> getAllAllocations() {
        return ResponseEntity.ok(allocationService.getAllAllocations());
    }

    @PostMapping
    public ResponseEntity<AllocationDto> createAllocation(@RequestBody AllocationDto allocationDto) {
        return ResponseEntity.ok(allocationService.createAllocation(allocationDto));
    }
}
