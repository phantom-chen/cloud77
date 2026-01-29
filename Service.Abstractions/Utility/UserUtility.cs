using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Cloud77.Abstractions.Utility
{
    public class UserUtility
    {
        public static bool IsEmailFormat(string email)
        {
            string pattern = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";
            return Regex.IsMatch(email, pattern);
        }

        public static bool PasswordIsComplex(string password, int minLength)
        {
            if (string.IsNullOrEmpty(password) || password.Length <= minLength)
            {
                return false;
            }

            bool hasUpper = false;
            bool hasLower = false;
            bool hasSpecial = false;
            bool hasDigit = false;

            foreach (char c in password)
            {
                if (char.IsUpper(c))
                {
                    hasUpper = true;
                }
                else if (char.IsLower(c))
                {
                    hasLower = true;
                }
                else if (char.IsDigit(c))
                {
                    hasDigit = true;
                }
                else if (!char.IsLetterOrDigit(c))
                {
                    hasSpecial = true;
                }
                if (hasUpper && hasLower && hasSpecial && hasDigit)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
