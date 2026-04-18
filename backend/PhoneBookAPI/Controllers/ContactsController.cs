using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhoneBookAPI.DTOs;
using PhoneBookAPI.Interfaces;

namespace PhoneBookAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ContactsController : ControllerBase
{
    private readonly IContactRepository _contactsRepository;

    public ContactsController(IContactRepository contactsRepository)
    {
        _contactsRepository = contactsRepository;
    }

    [HttpGet]
    public async Task<ActionResult<List<ContactDTO>>> Get()
    {
        var contacts = await _contactsRepository.GetAllContacts();

        if (!User.IsInRole("Admin"))
        {
            contacts.ForEach(c => c.Address = null);
        }

        return Ok(contacts);
    }
}