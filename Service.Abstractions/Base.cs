namespace Cloud77.Abstractions
{
    public interface IUserResult
    {
        string Email { get; set; }
    }

    public class BaseQuery
    {
        public int Index { get; set; } = 0;
        public int Size { get; set; } = 10;
        public string Sort { get; set; } = "desc";
    }

    public class QueryResults
    {
        public int Total { get; set; }
        public string Query { get; set; }
        public int Index { get; set; }
        public int Size { get; set; }
    }
}
