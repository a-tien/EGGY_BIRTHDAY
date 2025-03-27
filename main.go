package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	var err error
	connStr := "host=" + os.Getenv("DB_HOST") +
		" port=5432 user=" + os.Getenv("DB_USER") +
		" password=" + os.Getenv("DB_PASS") +
		" dbname=" + os.Getenv("DB_NAME") +
		" sslmode=disable"

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("❌ 連線資料庫失敗:", err)
	}
	defer db.Close()

	http.HandleFunc("/api/balloon", withCORS(handleBalloon))
	http.HandleFunc("/api/messages", withCORS(handleMessages))

	log.Println("✅ 後端 API 啟動在 :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

// CORS 中介層
func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func handleBalloon(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		var count int
		err := db.QueryRow("SELECT count FROM balloon_counts WHERE id = 1").Scan(&count)
		if err != nil {
			http.Error(w, "查詢失敗", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]int{"count": count})

	case "POST":
		_, err := db.Exec("UPDATE balloon_counts SET count = count + 1 WHERE id = 1")
		if err != nil {
			http.Error(w, "更新失敗", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)

	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func handleMessages(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		rows, err := db.Query("SELECT content, created_at FROM messages ORDER BY id DESC LIMIT 30")
		if err != nil {
			http.Error(w, "查詢失敗", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		type Msg struct {
			Content   string    `json:"content"`
			CreatedAt time.Time `json:"created_at"`
		}
		var result []Msg

		for rows.Next() {
			var m Msg
			if err := rows.Scan(&m.Content, &m.CreatedAt); err == nil {
				result = append(result, m)
			}
		}
		json.NewEncoder(w).Encode(result)

	case "POST":
		var input struct {
			Content string `json:"content"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Content == "" {
			http.Error(w, "格式錯誤", http.StatusBadRequest)
			return
		}
		_, err := db.Exec("INSERT INTO messages (content) VALUES ($1)", input.Content)
		if err != nil {
			http.Error(w, "寫入失敗", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)

	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}
