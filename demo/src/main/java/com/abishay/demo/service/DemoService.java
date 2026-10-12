package com.abishay.demo.service;

import java.util.List;

import com.abishay.demo.model.DemoEntity;

public interface DemoService  {
	
//	create data
	public abstract DemoEntity addDemoDetails(DemoEntity d);
	
//	get data 
	public abstract List<DemoEntity> getDemoDetails();
	
//	get a single data
	public abstract DemoEntity getDemo(Integer id);
	
//	update data
	public abstract DemoEntity updateDemoDetails(DemoEntity d,Integer id);
	
	public DemoEntity updateName(DemoEntity d,Integer id);
	
//	delete data
	public abstract void deleteDemoDetails(Integer id);
	

}
