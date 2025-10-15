using Cloud77.Abstractions.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Service
{
    public class Bookmark : BookmarkEntity
    {
        public string Id { get; set; }
    }
    public class BookmarksResult : QueryResults
    {
        public Bookmark[] Data = Array.Empty<Bookmark>();
    }

    public class EmptyBookmark : ServiceResponse
    {
        public EmptyBookmark()
        {
            Code = "empty-bookmark";
            Message = "find no bookmarks";
        }
    }

    public class BookmarkCreated : ServiceResponse
    {
        public BookmarkCreated(string id)
        {
            Id = id;
            Code = "bookmark-created";
            Message = $"Bookmark is created successfully with id {id}";
        }
    }

    public class BookmarkUpdated : ServiceResponse
    {
        public BookmarkUpdated(string id)
        {
            Id = id;
            Code = "bookmark-updated";
            Message = $"Bookmark is updated successfully with id {id}";
        }
    }

    public class BookmarkDeleted : ServiceResponse
    {
        public BookmarkDeleted(string id)
        {
            Id = id;
            Code = "bookmark-deleted";
            Message = $"Bookmark is deleted successfully with id {id}";
        }
    }
}
