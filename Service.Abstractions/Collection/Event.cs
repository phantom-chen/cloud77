using Cloud77.Abstractions.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Collection
{
    public interface IEventCollection
    {
        IEnumerable<EventEntity> GetEventLogs(string email);
        IEnumerable<EventEntity> GetEventLogs(string name, int index, int size);
        string AppendEventLog(EventEntity entity);
        string CreateVerificationCode(string email);
        IEnumerable<TokenPayload> GetTokenPayloads(string email);
        bool DeleteOne(string id);
        bool DeleteSome(string email);
    }
}
