package com.abishay.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abishay.demo.model.DemoEntity;
import com.abishay.demo.service.DemoService;

@RestController
@RequestMapping("/dmo")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DemoControllers {

	@Autowired
	DemoService demoservie;
	
	@PostMapping("/add")
	public ResponseEntity<DemoEntity> add(@RequestBody DemoEntity d) {
		DemoEntity saved = demoservie.addDemoDetails(d);
		return new ResponseEntity<>(saved, HttpStatus.CREATED);
	}
	
	@GetMapping("/get")
	public ResponseEntity<List<DemoEntity>> getAll() {
		return ResponseEntity.ok(demoservie.getDemoDetails());
	}
	
	@GetMapping("/getid/{id}")
	public ResponseEntity<?> get(@PathVariable Integer id) {
		DemoEntity demo = demoservie.getDemo(id);
		if (demo == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Record not found with ID: " + id);
		}
		return ResponseEntity.ok(demo);
	}
	
	@PutMapping("/update/{id}")
	public ResponseEntity<?> updateDetails(@RequestBody DemoEntity d, @PathVariable Integer id) {
		DemoEntity updated = demoservie.updateDemoDetails(d, id);
		if (updated == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Record not found with ID: " + id);
		}
		return ResponseEntity.ok(updated);
	}
	
	@PatchMapping("/updatename/{id}")
	public ResponseEntity<?> updateName(@RequestBody DemoEntity d, @PathVariable Integer id) {
		DemoEntity updated = demoservie.updateName(d, id);
		if (updated == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Record not found with ID: " + id);
		}
		return ResponseEntity.ok(updated);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteDetails(@PathVariable Integer id) {
		demoservie.deleteDemoDetails(id);
		return ResponseEntity.ok(id + " details deleted successfully.");
	}
	
}
