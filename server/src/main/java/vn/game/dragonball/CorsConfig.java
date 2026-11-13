package vn.game.dragonball;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Cho phép trang web (Vite dev, GitHub Pages...) gọi API từ origin khác. */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    private final String[] origins;

    public CorsConfig(@Value("${game.cors.origins}") String[] origins) {
        this.origins = origins;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(origins)
                .allowedMethods("GET", "PUT", "POST", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
