package com.abishay.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abishay.demo.model.DemoEntity;
import com.abishay.demo.repo.DemoRepo;

@Service
public class DemoServiceImpl implements DemoService {

	@Autowired
	DemoRepo demorepo;
	
	@Override
	public DemoEntity addDemoDetails(DemoEntity d) {
		return demorepo.save(d);
	}

	@Override
	public List<DemoEntity> getDemoDetails() {
		return demorepo.findAll();
	}

	@Override
	public DemoEntity updateDemoDetails(DemoEntity d, Integer id) {
		DemoEntity demoFromDb = getDemo(id);
		if (demoFromDb == null) {
			return null;
		}
		demoFromDb.setEmail(d.getEmail());
		demoFromDb.setName(d.getName());
		demoFromDb.setNumber(d.getNumber());
		return demorepo.save(demoFromDb);
	}
	
	@Override
	public DemoEntity updateName(DemoEntity d, Integer id) {
		DemoEntity changeName = getDemo(id);
		if (changeName == null) {
			return null;
		}
		changeName.setName(d.getName());
		return demorepo.save(changeName);
	}

	@Override
	public void deleteDemoDetails(Integer id) {
		if (demorepo.existsById(id)) {
			demorepo.deleteById(id);
		}
	}

	@Override
	public DemoEntity getDemo(Integer id) {
		return demorepo.findById(id).orElse(null);
	}

}
