using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
namespace Catalog.Models
{
    [Index(nameof(Username), IsUnique = true)]
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(ClusterRandomId), IsUnique = true)]
    public class User{
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        [MaxLength(20)]
        public string Password  { get; set; }
        [Required]
        public int ClusterRandomId { get; set; }
        public string LastWorkText { get; set; }
    }
}