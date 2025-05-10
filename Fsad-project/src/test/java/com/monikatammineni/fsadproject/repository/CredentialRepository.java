package com.monikatammineni.fsadproject.repository;

import com.monikatammineni.fsadproject.entity.Credential;
import org.springframework.data.repository.CrudRepository;

public interface CredentialRepository extends CrudRepository<Credential, Integer> {

    Credential findByEmailAndPassword(String email, String password);

    Credential findByEmail(String email);

    Credential findByUserId(int userId);
}
