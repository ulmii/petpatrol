package com.example.angularjs.controller;

import com.example.angularjs.model.User;
import com.example.angularjs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@RestController
public class UserController
{
    private final UserService service;

    @Autowired
    public UserController(UserService service)
    {
        this.service = service;
    }

//    @GetMapping(value = "/users")
//    public List<User> getUsers()
//    {
//        return service.all();
//    }

}
