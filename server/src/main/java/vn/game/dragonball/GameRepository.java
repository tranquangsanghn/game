package vn.game.dragonball;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import vn.game.dragonball.SaveDtos.DiemRequest;
import vn.game.dragonball.SaveDtos.DiemResponse;
import vn.game.dragonball.SaveDtos.LuuRequest;
import vn.game.dragonball.SaveDtos.LuuResponse;

/** Truy cập MySQL bằng JDBC thuần (2 bảng: game_save, game_score). */
@Repository
public class GameRepository {
    private final JdbcTemplate jdbc;
    private final ObjectMapper json;

    public GameRepository(JdbcTemplate jdbc, ObjectMapper json) {
        this.jdbc = jdbc;
        this.json = json;
    }

    public void luu(String nguoiChoi, LuuRequest r) {
        jdbc.update("""
                INSERT INTO game_save (player, score, play_seconds, state, saved_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON DUPLICATE KEY UPDATE score = VALUES(score), play_seconds = VALUES(play_seconds),
                                        state = VALUES(state), saved_at = CURRENT_TIMESTAMP
                """, nguoiChoi, r.diem(), r.thoiGian(), r.trangThai().toString());
    }

    public Optional<LuuResponse> docLuu(String nguoiChoi) {
        return jdbc.query("SELECT player, score, play_seconds, state, saved_at FROM game_save WHERE player = ?",
                (rs, i) -> new LuuResponse(rs.getString("player"), rs.getInt("score"), rs.getInt("play_seconds"),
                        rs.getTimestamp("saved_at").toInstant(), doc(rs.getString("state"))),
                nguoiChoi).stream().findFirst();
    }

    public boolean xoaLuu(String nguoiChoi) {
        return jdbc.update("DELETE FROM game_save WHERE player = ?", nguoiChoi) > 0;
    }

    public void ghiDiem(String nguoiChoi, DiemRequest r) {
        jdbc.update("INSERT INTO game_score (player, score, mabu_score, zinbu_score, play_seconds) VALUES (?, ?, ?, ?, ?)",
                nguoiChoi, r.diem(), r.diemMabu(), r.diemZinbu(), r.thoiGian());
    }

    public List<DiemResponse> diemCao(int gioiHan) {
        return jdbc.query("SELECT player, score, mabu_score, zinbu_score, play_seconds, created_at FROM game_score ORDER BY score DESC, id ASC LIMIT ?",
                (rs, i) -> new DiemResponse(rs.getString("player"), rs.getInt("score"), rs.getInt("mabu_score"),
                        rs.getInt("zinbu_score"), rs.getInt("play_seconds"), rs.getTimestamp("created_at").toInstant()),
                gioiHan);
    }

    private JsonNode doc(String s) {
        try {
            return json.readTree(s);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Dữ liệu lưu trong DB không phải JSON hợp lệ", e);
        }
    }
}
