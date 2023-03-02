using System;
using System.Collections.Generic;
using System.Linq;
using Catalog.Models;

namespace Catalog.Data{

    //The implementation of the Repository (SqlUserRepo) makes use of 2 things:
    // 1. IUserRepo: this is the interface (contract of methods) we created 
    //              before. Here we have defined what are the methods that we
    //              will use for the API. Bc of it's an interface, we do not
    //              specify how the method will be implemented. We just
    //              define that it will exist.
    //              In the SqlUserRepo, due to we are implementing it, we
    //              will code it.
    //
    // 2. UserContext: basically, the DBContext we have to deal with.
    //                  It's going to be injected. Our class needs this
    //                  DBContext to 'access' to the DataBase.
    //                  We will make use of its only Table, 'Users'.
    //                  We will work on this DataSet and its
    //                  own Add/Delete... methods. The configuration of the
    //                  UserContext (DB) class will save everything on the SqlServer

    //implementation of the interface (contract of methods) we created before
    public class SqlUserRepo : IUserRepo 
    {
        private readonly UserContext _context;

        public SqlUserRepo(UserContext userContext)
        {
            _context = userContext; //Dependency Injection, specified in Startup.services. 
        }
        public void CreateUser(User u)
        {
            if (u == null){
                throw new ArgumentNullException(nameof(u)); 
            }
            else
            {
                _context.Users.Add(u);
            }
        }

        public void DeleteUser(User u)
        {
            if(u != null)
            {
                _context.Users.Remove(u);
            }
        }

        public bool EmailExists(string emailArg)
        {
            User myUser = _context.Users.FirstOrDefault<User>(user => user.Email == emailArg);
            if(myUser != null){
                return true;
            }
            return false;   
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User GetUser(string usernameArg, string passwordArg)
        {
            User myUser = _context.Users.FirstOrDefault<User>(user => user.Username == usernameArg);
            if(myUser != null && myUser.Password == passwordArg){
                return myUser;
            }
            return null;
            
        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }

        public User UpdateLastWorkText(User u)
        {
            throw new NotImplementedException();
        }

        public bool UsernameExists(string usernameArg)
        {
            User myUser = _context.Users.FirstOrDefault<User>(user => user.Username == usernameArg);
            if(myUser != null){
                return true;
            }
            return false; 
        }
    }
}