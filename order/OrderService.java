import com.sun.net.httpserver.*;
import java.net.*;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.*;

public class OrderService {
    static final List<String> orders = new CopyOnWriteArrayList<>();
    static final AtomicInteger created = new AtomicInteger();
    static final String INV = System.getenv().getOrDefault("INVENTORY_URL", "http://inventory:8082");
    static final HttpClient http = HttpClient.newHttpClient();

    static void send(HttpExchange e, int code, String body, String type) throws java.io.IOException {
        byte[] b = body.getBytes(StandardCharsets.UTF_8);
        e.getResponseHeaders().set("Content-Type", type);
        e.sendResponseHeaders(code, b.length);
        e.getResponseBody().write(b);
        e.close();
    }

    static void handleOrders(HttpExchange e) throws java.io.IOException {
        if ("GET".equals(e.getRequestMethod())) {
            send(e, 200, "[" + String.join(",", orders) + "]", "application/json");
            return;
        }
        String body = new String(e.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        Matcher p = Pattern.compile("\"productId\"\\s*:\\s*\"?([^\",}\\s]+)").matcher(body);
        Matcher q = Pattern.compile("\"qty\"\\s*:\\s*(\\d+)").matcher(body);
        if (!p.find() || !q.find()) { send(e, 400, "{\"error\":\"productId and qty required\"}", "application/json"); return; }
        String pid = p.group(1); int qty = Integer.parseInt(q.group(1));
        try {
            HttpRequest r = HttpRequest.newBuilder(URI.create(INV + "/reserve"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"productId\":\"" + pid + "\",\"qty\":" + qty + "}")).build();
            HttpResponse<String> resp = http.send(r, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() != 200) { send(e, 409, "{\"error\":\"could not reserve stock\"}", "application/json"); return; }
            String order = "{\"id\":\"" + UUID.randomUUID() + "\",\"productId\":\"" + pid + "\",\"qty\":" + qty + ",\"status\":\"CONFIRMED\"}";
            orders.add(order); created.incrementAndGet();
            send(e, 201, order, "application/json");
        } catch (Exception ex) {
            send(e, 502, "{\"error\":\"inventory unavailable\"}", "application/json");
        }
    }

    public static void main(String[] args) throws Exception {
        HttpServer s = HttpServer.create(new InetSocketAddress(8083), 0);
        s.createContext("/health", e -> send(e, 200, "{\"status\":\"ok\"}", "application/json"));
        s.createContext("/metrics", e -> send(e, 200,
            "# TYPE orders_created_total counter\norders_created_total " + created.get() + "\n", "text/plain"));
        s.createContext("/orders", e -> handleOrders(e));
        s.setExecutor(Executors.newFixedThreadPool(8));
        s.start();
        System.out.println("order :8083");
    }
}
