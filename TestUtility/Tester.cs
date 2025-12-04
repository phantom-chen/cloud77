using Cloud77.Abstractions.Service;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;

namespace TestUtility
{
    public class Tester
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string AccessToken { get; set; } = "";
        public string RefreshToken { get; set; } = "";
    }

    public class TesterModel
    {
        private string root;

        private Tester data;

        public string Root => root;

        public Tester User => data;

        public TesterModel()
        {

        }

        public void Load(string root, string id)
        {
            this.root = root;
            Id = id;

            if (string.IsNullOrEmpty(id)) return;

            if (File.Exists(Path.Combine(root, $"{id}.json")))
            {
                var json = File.ReadAllText(Path.Combine(root, $"{id}.json"));
                data = JsonSerializer.Deserialize<Tester>(json) ?? new Tester();
            }
            else
            {
                SaveUser();
            }
        }

        public string Id { get; private set; }

        private void SaveUser()
        {
            File.WriteAllText(Path.Combine(root, $"{Id}.json"), JsonSerializer.Serialize<Tester>(data));
        }

        public void SaveToken(UserToken userToken)
        {
            data.AccessToken = userToken.Value;
            data.RefreshToken = userToken.RefreshToken;
            SaveUser();
        }
    }
}
