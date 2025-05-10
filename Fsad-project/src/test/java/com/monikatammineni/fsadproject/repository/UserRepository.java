package com.monikatammineni.fsadproject.repository;

import com.monikatammineni.fsadproject.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {

    User findById(int id);

    List<User> findByAccountType(String accountType);

    User save(User user);


    //    List<User> findByEmail(String email);
    User findByEmail(String email);

}
