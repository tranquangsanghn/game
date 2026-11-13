package vn.game.dragonball;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import vn.game.dragonball.SaveDtos.*;

/**
 * API của game:
 *   GET    /api/saves/{nguoiChoi}   lấy ván đã lưu (404 nếu chưa có)
 *   PUT    /api/saves/{nguoiChoi}   lưu / ghi đè ván đang chơi
 *   DELETE /api/saves/{nguoiChoi}   xoá ván đã lưu
 *   POST   /api/scores              ghi điểm một ván đã kết thúc
 *   GET    /api/scores?limit=5      bảng điểm cao nhất
 */
@RestController
@RequestMapping("/api")
public class GameController {
    private static final int TOI_DA_TEN = 64;
    private static final int TOI_DA_TRANG_THAI = 8_000_000;

    private final GameRepository repo;

    public GameController(GameRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/saves/{nguoiChoi}")
    public LuuResponse layLuu(@PathVariable String nguoiChoi) {
        return repo.docLuu(ten(nguoiChoi)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa có ván lưu"));
    }

    @PutMapping("/saves/{nguoiChoi}")
    public ResponseEntity<Void> luu(@PathVariable String nguoiChoi, @Valid @RequestBody LuuRequest r) {
        if (r.trangThai().toString().length() > TOI_DA_TRANG_THAI) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Dữ liệu lưu quá lớn");
        }
        repo.luu(ten(nguoiChoi), r);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/saves/{nguoiChoi}")
    public ResponseEntity<Void> xoaLuu(@PathVariable String nguoiChoi) {
        repo.xoaLuu(ten(nguoiChoi));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/scores")
    public ResponseEntity<Void> ghiDiem(@Valid @RequestBody DiemRequest r) {
        repo.ghiDiem(ten(r.nguoiChoi()), r);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/scores")
    public List<DiemResponse> diemCao(@RequestParam(defaultValue = "10") int limit) {
        return repo.diemCao(Math.max(1, Math.min(limit, 100)));
    }

    private static String ten(String s) {
        String t = s == null ? "" : s.trim();
        if (t.isEmpty() || t.length() > TOI_DA_TEN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên người chơi phải từ 1 đến " + TOI_DA_TEN + " ký tự");
        }
        return t;
    }
}
