package com.monikatammineni.fsadproject.repository;

import com.monikatammineni.fsadproject.entity.Files;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface FileRepository extends CrudRepository<Files, Integer> {
    Files findByFileId(int fileId);

    Files findByFileCode(String fileCode);

    Files findByFileName(String fileName);

    Files save(Files file);

    List<Files> findByUserId(int userId);
}

