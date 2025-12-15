// Utility executable that initializes the SQLite database storing completed projects.
// Compile and run once to ensure the schema exists before persisting project summaries.

#include <cstdlib>
#include <iostream>

#include <sqlite3.h>

namespace {
constexpr const char* kDatabaseName = "completed_projects.db";

constexpr const char* kCreateCompletedProjectsSql = R"SQL(
	CREATE TABLE IF NOT EXISTS completed_projects (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		project_title TEXT NOT NULL,
		owner_username TEXT,
		project_identifier TEXT,
		sections_completed INTEGER DEFAULT 0,
		total_sections INTEGER DEFAULT 0,
		completion_date TEXT NOT NULL,
		notes TEXT,
		archived INTEGER DEFAULT 0 CHECK (archived IN (0, 1))
	);
)SQL";

constexpr const char* kCreateCompletionDateIndexSql = R"SQL(
	CREATE INDEX IF NOT EXISTS idx_completed_projects_date
	ON completed_projects(completion_date);
)SQL";

bool executeSql(sqlite3* db, const char* sql) {
	char* errMessage = nullptr;
	const int status = sqlite3_exec(db, sql, nullptr, nullptr, &errMessage);
	if (status != SQLITE_OK) {
		std::cerr << "SQL error: " << (errMessage ? errMessage : "Unknown") << '\n';
		sqlite3_free(errMessage);
		return false;
	}
	return true;
}
}  // namespace

int main() {
	sqlite3* db = nullptr;
	const int openStatus = sqlite3_open(kDatabaseName, &db);
	if (openStatus != SQLITE_OK) {
		std::cerr << "Failed to open '" << kDatabaseName << "': "
							<< sqlite3_errstr(openStatus) << '\n';
		return EXIT_FAILURE;
	}

	if (!executeSql(db, "PRAGMA journal_mode=WAL;")) {
		sqlite3_close(db);
		return EXIT_FAILURE;
	}

	if (!executeSql(db, kCreateCompletedProjectsSql) ||
			!executeSql(db, kCreateCompletionDateIndexSql)) {
		sqlite3_close(db);
		return EXIT_FAILURE;
	}

	std::cout << "Completed projects database initialized at '" << kDatabaseName
						<< "'." << std::endl;
	sqlite3_close(db);
	return EXIT_SUCCESS;
}
