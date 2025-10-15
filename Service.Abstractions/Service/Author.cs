using Cloud77.Abstractions.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Service
{
    //public class AuthorsResult : QueryResults
    //{
    //  public AuthorMongoEntity[] Data = Array.Empty<AuthorMongoEntity>();
    //}

    public class Author : AuthorEntity
    {
        public string Id { get; set; }
    }

    public class AuthorsResult : QueryResults
    {
        public IEnumerable<Author> Data;
    }

    public class EmptyAuthor : ServiceResponse
    {
        public EmptyAuthor()
        {
            Code = "empty-author";
            Message = "find no authors";
        }
    }

    public class AuthorCreated : ServiceResponse
    {
        public AuthorCreated(string id)
        {
            Id = id;
            Code = "author-created";
            Message = $"Author is created successfully with id {id}";
        }
    }

    public class AuthorUpdated : ServiceResponse
    {
        public AuthorUpdated(string id)
        {
            Id = id;
            Code = "author-updated";
            Message = $"Author is updated successfully with id {id}";
        }
    }

    public class AuthorDeleted : ServiceResponse
    {
        public AuthorDeleted(string id)
        {
            Id = id;
            Code = "author-deleted";
            Message = $"Author is deleted successfully with id {id}";
        }
    }
}
