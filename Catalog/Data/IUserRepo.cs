using System.Collections.Generic;
using Catalog.Models;

namespace Catalog.Data{

    public interface IUserRepo {
        bool SaveChanges();
        void CreateUser(User u);
        IEnumerable<User> GetAllUsers();
        User GetUser(string usernameArg, string passwordArg);

        void DeleteUser(User u);

        bool UsernameExists(string username);

        bool EmailExists(string email);

        
    }
}