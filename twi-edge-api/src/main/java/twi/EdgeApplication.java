package twi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

/**
 * this is a proxy to both the backend bookmark-api and the static HTML
 * site that provides the experience for this system.
 *
 * @author Josh Long
 */
@SpringBootApplication
public class EdgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(EdgeApplication.class, args);
    }

    @Bean
    RouteLocator gateway(RouteLocatorBuilder rlb) {
        return rlb
                .routes()
                .route(rs -> rs
                        .path("/api/**")
                        .filters(f -> f.tokenRelay().rewritePath("/api/(?<segment>.*)", "/$\\{segment}"))
                        .uri("http://localhost:8081"))
                .route(rs -> rs.path("/**").uri("http://127.0.0.1:8084"))
                .build();
    }
}

