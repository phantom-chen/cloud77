using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooler.Client.Providers
{
    public class BookmarkProvider : IBookmarkProvider
    {
        private AppDatabase context;

        public BookmarkProvider(string source)
        {
            context = new AppDatabase(source);
        }

        public IEnumerable<Bookmark> GetBookmarks(int index, int size)
        {
            return context.Bookmarks.OrderByDescending(b => b.Id).Skip(index * size).Take(size);
        }

        private static int counter = 0;

        private static List<string> hrefs = new List<string>();

        public void CleanUp()
        {
            var size = 100;
            var bookmarks = context.Bookmarks.OrderBy(b => b.Id).Skip(counter * size).Take(size).ToList();

            var change = false;
            foreach (var bookmark in bookmarks)
            {
                if (hrefs.Contains(bookmark.Href))
                {
                    // href is not unique
                    context.Bookmarks.Remove(bookmark);
                    change = true;
                }
                else
                {
                    hrefs.Add(bookmark.Href);
                }
            }
            if (change)
            {
                context.SaveChanges();
            }

            counter++;
        }

        public int Count()
        {
            return context.Bookmarks.Count();
        }

        public int UniqueCount()
        {
            var hrefs = context.Bookmarks.ToArray().Select(mark => mark.Href).Distinct();
            return hrefs.Count();
        }

        public void UpdateBookmark(Bookmark bookmark)
        {
            if (bookmark == null) return;
            var stamp = DateTime.Now;
            if (bookmark.Id > 0)
            {
                // update
                bookmark.Timestamp = stamp;
                context.Bookmarks.AddOrUpdate(bookmark);
            }
            else
            {
                // add
                //bookmark.CreatedAt = new SqlDateTime(DateTime.Now);
                //bookmark.Timestamp = new SqlDateTime(DateTime.Now);
                bookmark.CreatedAt = stamp;
                bookmark.Timestamp = stamp;
                context.Bookmarks.AddOrUpdate(new Bookmark[] { bookmark });
            }
            context.SaveChanges();
        }

        public void DeleteBookmark(long id)
        {
            var mark = context.Bookmarks.FirstOrDefault(b => b.Id == id);
            if (mark != null)
            {
                context.Bookmarks.Remove(mark);
                context.SaveChanges();
            }
        }
    }
}
