using Cloud77.Abstractions.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Collection
{
    internal interface IEventCollection
    {
        /// <summary>
        /// Get the event logs for specified email.
        /// </summary>
        /// <param name="email"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        IEnumerable<EventEntity> GetEventLogs(string email, string name);

        /// <summary>
        /// Get the event logs for specified name with pagination, used for management.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="index"></param>
        /// <param name="size"></param>
        /// <returns></returns>
        IEnumerable<EventEntity> GetEventLogs(string name, int index, int size);

        /// <summary>
        /// Get the event log by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        EventEntity GetEventLog(string id);

        /// <summary>
        /// Append an event log.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        string AppendEventLog(EventEntity entity);

        /// <summary>
        /// Delete the event log by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        bool DeleteEventLog(string id);

        /// <summary>
        /// Delete event logs for specified email.
        /// </summary>
        /// <param name="email"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        bool DeleteEventLogs(string email, string name);
    }
}
