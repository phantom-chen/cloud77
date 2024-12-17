using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooler.Plus.Models
{
    public class MainModel : BaseModel
    {
        public MainModel()
        {
            _status = "Network"; // NetworkOff
            _statusText = "Online"; // Online Offline
        }

        public string AboutMeTitle = "About Cooler Plus Desktop";

        public string AboutMeContent = "This computer program is protected by copyright law. Unauthorized production or distribution of any portion of this program will be prosecuted to the maximum extent possible under law.";

        string title = "Cooler Plus";

        public string Title
        {
            get => title;
            set
            {
                title = value;
                RaisePropertyChanged("Title");
            }
        }

        private string subtitle = "My First Material Design App";
        public string SubTitle
        {
            get
            {
                return subtitle;
            }
            set
            {
                subtitle = value;
                RaisePropertyChanged("SubTitle");
            }
        }

        private string _userName = "visitor";

        public string UserName
        {
            get { return _userName; }
            set
            {
                _userName = value;
                RaisePropertyChanged("UserName");
            }
        }

        string _email = "demo@demo.com";
        public string Email
        {
            get => _email;
            set
            {
                _email = value;
                RaisePropertyChanged("Email");
            }
        }

        string _status;
        public string Status
        {
            get => _status;
            set
            {
                _status = value;
                RaisePropertyChanged("Status");
            }
        }

        string _statusText;
        public string StatusText
        {
            get => _statusText;
            set
            {
                _statusText = value;
                RaisePropertyChanged("StatusText");
            }
        }
    }
}
