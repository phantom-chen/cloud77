using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Service
{
    public class EmptySetting : ServiceResponse
    {
        public EmptySetting() {
            Code = "empty-setting";
            Message = "the setting key is empty, please put that in the request";
        }
    }

    public class SettingNotExisting : ServiceResponse
    {
        public SettingNotExisting()
        {
            Code = "setting-not-existing";
            Message = "the setting does not exist";
        }
    }

    public class SettingCreated : ServiceResponse
    {
        public SettingCreated(string id) : base("setting-created", id, "setting created") { }
    }

    public class SettingUpdated : ServiceResponse
    {
        public SettingUpdated(string id) : base("setting-updated", id, "setting updated") { }
    }

    public class SettingDeleted : ServiceResponse
    {
        public SettingDeleted(string id) : base("setting-deleted", id, "setting deleted") { }
    }
}
