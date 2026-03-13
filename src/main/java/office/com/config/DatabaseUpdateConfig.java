package office.com.config;

import org.springframework.stereotype.Component;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class DatabaseUpdateConfig implements ApplicationRunner {

    private final DataSource dataSource;

    public DatabaseUpdateConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            ResultSet rs = meta.getColumns(null, null, "students", "joining_date");
            if (!rs.next()) {
                // column does not exist, add it nullable first to avoid zero-date errors
                conn.createStatement().execute(
                        "ALTER TABLE students ADD COLUMN joining_date DATE NULL");
                // populate existing rows with current date
                conn.createStatement().execute(
                        "UPDATE students SET joining_date = CURRENT_DATE() WHERE joining_date IS NULL");
                // optionally enforce not-null constraint
                conn.createStatement().execute(
                        "ALTER TABLE students MODIFY COLUMN joining_date DATE NOT NULL");
                System.out.println("Added joining_date column to students table (nullable -> populated -> not null)");
            }
            rs.close();
        } catch (SQLException e) {
            // log and ignore
            System.err.println("Error checking/adding joining_date column: " + e.getMessage());
        }
    }
}
