package vn.game.dragonball;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class GameControllerTest {
    @Autowired MockMvc mvc;

    @Test
    void luuRoiDocLaiDungNguyenKhoiJson() throws Exception {
        mvc.perform(get("/api/saves/An")).andExpect(status().isNotFound());

        String body = "{\"diem\":120,\"thoiGian\":65,\"trangThai\":{\"phienBan\":1,\"ga\":[{\"id\":1,\"x\":10.5}],\"ten\":\"Mabu ê\"}}";
        mvc.perform(put("/api/saves/An").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isNoContent());

        mvc.perform(get("/api/saves/An"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.diem").value(120))
                .andExpect(jsonPath("$.thoiGian").value(65))
                .andExpect(jsonPath("$.trangThai.ga[0].x").value(10.5))
                .andExpect(jsonPath("$.trangThai.ten").value("Mabu ê"))
                .andExpect(jsonPath("$.luuLuc").exists());

        // lưu lại thì ghi đè
        mvc.perform(put("/api/saves/An").contentType(MediaType.APPLICATION_JSON)
                .content("{\"diem\":300,\"thoiGian\":90,\"trangThai\":{\"phienBan\":1}}")).andExpect(status().isNoContent());
        mvc.perform(get("/api/saves/An")).andExpect(jsonPath("$.diem").value(300));

        mvc.perform(delete("/api/saves/An")).andExpect(status().isNoContent());
        mvc.perform(get("/api/saves/An")).andExpect(status().isNotFound());
    }

    @Test
    void bangDiemXepTheoDiemGiamDan() throws Exception {
        for (int d : new int[] {50, 400, 200}) {
            mvc.perform(post("/api/scores").contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nguoiChoi\":\"B\",\"diem\":" + d + ",\"diemMabu\":1,\"diemZinbu\":2,\"thoiGian\":30}"))
                    .andExpect(status().isCreated());
        }
        mvc.perform(get("/api/scores?limit=2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].diem").value(400))
                .andExpect(jsonPath("$[1].diem").value(200));
    }

    @Test
    void tenKhongHopLeBiTuChoi() throws Exception {
        mvc.perform(put("/api/saves/" + "x".repeat(65)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"diem\":1,\"thoiGian\":1,\"trangThai\":{}}")).andExpect(status().isBadRequest());
        mvc.perform(put("/api/saves/C").contentType(MediaType.APPLICATION_JSON)
                .content("{\"diem\":-1,\"thoiGian\":1,\"trangThai\":{}}")).andExpect(status().isBadRequest());
    }
}
