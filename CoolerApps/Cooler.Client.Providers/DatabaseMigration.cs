using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooler.Client.Providers
{
    public class DatabaseMigration
    {
        public DatabaseMigration(string path)
        {
            this.path = path;

            var sql = "";
            if (GetColumns("Bookmarks").Count == 0)
            {
                sql = "CREATE TABLE Bookmarks (Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Guid TEXT (24) UNIQUE NOT NULL, Title TEXT NOT NULL, Href TEXT NOT NULL, Tags TEXT NOT NULL, Collection TEXT NOT NULL, Description TEXT NOT NULL, CreatedAt DATETIME NOT NULL, Timestamp DATETIME NOT NULL);";
                CreateDatabase(sql);
            }
            if (GetColumns("Testers").Count == 0)
            {
                sql = @"CREATE TABLE Testers (
    Id    INTEGER PRIMARY KEY AUTOINCREMENT,
    Guid  STRING  UNIQUE NOT NULL,
    Name STRING  NOT NULL
);";
                CreateDatabase(sql);
            }
        }

        private string connection => $"Data Source={path};";

        private readonly string path;

        private int CreateDatabase(string sql)
        {
            var result = -1;
            using (SQLiteConnection connection = new SQLiteConnection(this.connection))
            {
                if (connection.State != ConnectionState.Open)
                {
                    connection.Open();
                }
                IDbCommand command = connection.CreateCommand();
                command.CommandText = sql;
                result = command.ExecuteNonQuery(); // 0
            }

            return result;
        }

        public List<string> GetColumns(string table)
        {
            List<string> columnList = new List<string>();
            try
            {
                using (IDbConnection conn = new SQLiteConnection(connection))
                {
                    conn.Open();
                    if (!string.IsNullOrEmpty(table))
                    {
                        // Get all of the field names in table
                        string sqlfieldName = "Pragma Table_Info(" + table + ")";

                        //IDbConnection conn = Helper.GetUsersConnection();
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        IDbCommand cmd = conn.CreateCommand();

                        cmd.CommandText = sqlfieldName;
                        cmd.CommandType = CommandType.Text;

                        IDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            columnList.Add(dr["Name"].ToString());
                        }
                        dr.Close();
                        cmd.Dispose();
                    }
                }

                return columnList;
            }
            catch
            {
                return columnList;
            }
        }

        public int AddTester(string name)
        {
            var result = -1;
            using (SQLiteConnection connection = new SQLiteConnection(this.connection))
            {
                if (connection.State != ConnectionState.Open)
                {
                    connection.Open();
                }
                IDbCommand command = connection.CreateCommand();
                var guid = Guid.NewGuid().ToString();
                command.CommandText = $"INSERT INTO Testers (Guid, Name) VALUES (\"{guid}\", \"{name}\");";
                result = command.ExecuteNonQuery(); // 1
            }

            return result;
        }
    }
}
