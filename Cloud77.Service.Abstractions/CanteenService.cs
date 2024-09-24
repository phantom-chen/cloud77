using System;
using System.Collections.Generic;
using System.Text;
using Cloud77.Service.Entity;

namespace Cloud77.Service
{
    public class Bookmark
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Href { get; set; }
        public string Tags { get; set; }
        public string Collection { get; set; }
    }

    public class BookmarksResult : QueryResults
    {
        public IEnumerable<Bookmark> Data;
    }

    public class UserPost
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }

    public class UserPosts : QueryResults, IUserResult
    {
        public string Email { get; set; }
        public IEnumerable<UserPost> Data { get; set; }
    }

    public class UserFiles : QueryResults, IUserResult
    {
        public string Email { get; set; }
        public string[] Data { get; set; }
    }
}
