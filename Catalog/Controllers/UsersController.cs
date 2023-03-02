using System.Collections.Generic;
using Catalog.Data;
using Catalog.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace Catalog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase 
    {
        private readonly IUserRepo _repository;

        public UsersController (IUserRepo repo) 
        {
            _repository = repo; //Dependency Injection. Defined in 'Startup.services'.
        }

        //GET api/users
        [EnableCors("allowAllPolicy")]
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAllUsers()
        {
            var users = _repository.GetAllUsers();
            if(users != null){
                return Ok(users);
            }
            return NotFound();
        }

        //GET api/users/byparameters?Username="example"&Password="example" {get the user just passing his username and his password}
        [EnableCors("allowAllPolicy")]
        [HttpGet("byparameters")]
        public ActionResult<User> GetUser(string username, string password)
        {
            var userRetrieved = _repository.GetUser(username, password);
            if(userRetrieved == null){
                return NotFound();
            }
            return Ok(userRetrieved);
        }

        //GET api/users/byparameters/usr?Username="example"{check if the username exists}
        [EnableCors("allowAllPolicy")]
        [HttpGet("byparameters/usr")]
        public ActionResult<bool> UsernameExists(string username){
            var UsernameExists = _repository.UsernameExists(username);
            if(UsernameExists){
                return Ok(UsernameExists);
            }
            return NotFound(UsernameExists);
        }

        //GET api/users/byparameters/eml?Email="example"{check if the email exists}
        [EnableCors("allowAllPolicy")]
        [HttpGet("byparameters/eml")]
        public ActionResult<bool> EmailExists(string email){
            var EmailExists = _repository.EmailExists(email);
            if(EmailExists){
                return Ok(EmailExists);
            }
            return NotFound(EmailExists);
        }

        //POST api/users {body with the USER information, the information needs to be provided correctly}
        [EnableCors("allowAllPolicy")]
        [HttpPost]
        public ActionResult<User> CreateUser(User u){
            try{
                _repository.CreateUser(u);
                _repository.SaveChanges();
                return Ok(u);

            } catch {
                return BadRequest(); //bad request bc either the user or the email have been already chosen
            }
        }

        //DELETE api/users/byparameters?Username="example"&Password="example" {delete the user just passing his username and his password}
        [EnableCors("allowAllPolicy")]
        [HttpDelete("byparameters")]
        public ActionResult DeleteUserById (string username, string password){
            var userToDelete = _repository.GetUser(username, password);
            if (userToDelete == null) {
                return NotFound();
            }
            _repository.DeleteUser(userToDelete);
            _repository.SaveChanges();
            return NoContent();
        }
    }
}