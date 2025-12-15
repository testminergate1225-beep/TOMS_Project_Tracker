// Simple utility that initializes the SQLite database used for storing user logs.
// Run the compiled binary once to create/upgrade the schema locally.

#include <cstdlib>
#include <iostream>
#include <string>

#include <sqlite3.h>

namespace {
constexpr const char* kDatabaseName = "user_logs.db";

constexpr const char* kCreateLogsTableSql = R"SQL(
	CREATE TABLE IF NOT EXISTS user_logs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL,
		project_name TEXT,
		section TEXT,
		item TEXT,
		action TEXT NOT NULL,
		timestamp TEXT NOT NULL,
		latitude REAL,
		longitude REAL,
		accuracy REAL,
		metadata TEXT
	);
)SQL";

constexpr const char* kCreateTimestampIndexSql = R"SQL(
	CREATE INDEX IF NOT EXISTS idx_user_logs_timestamp
	ON user_logs(timestamp);
)SQL";

bool executeSql(sqlite3* db, const char* sql) {
	char* errMessage = nullptr;
	const int result = sqlite3_exec(db, sql, nullptr, nullptr, &errMessage);
	if (result != SQLITE_OK) {
		std::cerr << "SQL error: " << (errMessage ? errMessage : "Unknown") << '\n';
		sqlite3_free(errMessage);
		return false;
	}
	return true;
}
}  // namespace

int main() {
	sqlite3* db = nullptr;
	const int openResult = sqlite3_open(kDatabaseName, &db);
	if (openResult != SQLITE_OK) {
		std::cerr << "Failed to open database '" << kDatabaseName
							<< "': " << sqlite3_errstr(openResult) << '\n';
		return EXIT_FAILURE;
	}

	// Keep WAL mode for better durability while the dashboard appends new log entries.
	if (!executeSql(db, "PRAGMA journal_mode=WAL;")) {
		sqlite3_close(db);
		return EXIT_FAILURE;
	}

	if (!executeSql(db, kCreateLogsTableSql) ||
			!executeSql(db, kCreateTimestampIndexSql)) {
		sqlite3_close(db);
		return EXIT_FAILURE;
	}

	std::cout << "Database initialized successfully at '" << kDatabaseName << "'." << std::endl;
	sqlite3_close(db);
	return EXIT_SUCCESS;
}
