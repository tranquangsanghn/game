package vn.game.dragonball;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

/** Dữ liệu trao đổi với trình duyệt. `trangThai` là khối JSON của game, máy chủ chỉ lưu nguyên không đọc vào. */
public final class SaveDtos {
    private SaveDtos() {}

    public record LuuRequest(@Min(0) int diem, @Min(0) int thoiGian, @NotNull JsonNode trangThai) {}

    public record LuuResponse(String nguoiChoi, int diem, int thoiGian, Instant luuLuc, JsonNode trangThai) {}

    public record DiemRequest(String nguoiChoi, @Min(0) int diem, @Min(0) int diemMabu, @Min(0) int diemZinbu, @Min(0) int thoiGian) {}

    public record DiemResponse(String nguoiChoi, int diem, int diemMabu, int diemZinbu, int thoiGian, Instant luc) {}
}
