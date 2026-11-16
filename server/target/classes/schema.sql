-- Ván đang chơi dở: mỗi người chơi một bản lưu (lưu lại sẽ ghi đè)
CREATE TABLE IF NOT EXISTS game_save (
  player       VARCHAR(64) NOT NULL PRIMARY KEY,
  score        INT         NOT NULL DEFAULT 0,
  play_seconds INT         NOT NULL DEFAULT 0,
  state        LONGTEXT    NOT NULL,
  saved_at     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Điểm của các ván đã kết thúc (bảng xếp hạng, kỷ lục)
CREATE TABLE IF NOT EXISTS game_score (
  id           BIGINT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
  player       VARCHAR(64) NOT NULL,
  score        INT         NOT NULL,
  mabu_score   INT         NOT NULL DEFAULT 0,
  zinbu_score  INT         NOT NULL DEFAULT 0,
  play_seconds INT         NOT NULL DEFAULT 0,
  created_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_game_score_score (score)
);
