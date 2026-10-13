package com.abishay.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendForwardController {

    // Forward non-API, non-static routes to index.html for React SPA routing
    @GetMapping(value = {"/", "/{x:[\\w\\-]+}", "/{x:^(?!dmo$|auth$|api$)[\\w\\-]+}/**"})
    public String forward() {
        return "forward:/index.html";
    }
}
