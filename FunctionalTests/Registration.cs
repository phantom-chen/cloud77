using Cloud77.Abstractions.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FunctionalTests
{
    [TestClass()]
    public class Registration
    {
        [TestMethod()]
        public void TestMethod1()
        {
            // get gateway api key
            // [get]api/gateway
            //new ServiceGateway();

            // get service agent information
            // [get]api/{service}/agent
            new ServiceAgent();

            // check user is registered or not
            // [get]api/users?email=&username=
            new UserEmail();

            // create a user account
            // [post]api/users
            new UserCreated("", "");
            new EmptyAccount(); // empty email or name
            new EmptyPassword();
            new UserExisting("", ""); // user already exists
            //new InValidAccount(); // email or name is valid
            //new WeakPassword(); // weak password

            // reset password
            // [put]api/users/password

            // confirm email is correct
            // [put]api/users/verification

            // access token
            // [post]api/tokens
            new UserToken();
            new EmptyAccount();
            new EmptyPassword();// empty password or refresh token
            new UserNotExisting(""); // user not found
            new InCorrectPassword(""); // password incorrect

            // forget password, issue the reset token
            // [post]api/tokens/password

            // get user role from token
            // api/accounts/role
            new UserRole(); 
            new EmptyEmail(); // role is empty for anonymous user

            // get user account information
            // api/accounts/{email}
            new UserAccount();
            new UserNotExisting(""); // user not found
        }
    }
}
