package com.abishay.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.abishay.demo.model.DemoEntity;

@Repository
public interface DemoRepo extends JpaRepository<DemoEntity, Integer>{

}
