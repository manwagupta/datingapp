using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        public IMapper Mapper { get; }

        public MessageRepository(DataContext context, IMapper mapper)
        {
            Mapper = mapper;
            _context = context;

        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int Id)
        {
            return await _context.Messages.FindAsync(Id);
        }

        public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
            .OrderByDescending(m => m.Messagesent)
            .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.Recipient.UserName == messageParams.UserName),
                "Outbox" => query.Where(u => u.Sender.UserName == messageParams.UserName),
                _ => query.Where(u => u.Recipient.UserName == messageParams.UserName && u.DateRead == null)
            };

            var messages = query.ProjectTo<MessageDTO>(Mapper.ConfigurationProvider);

            return await PagedList<MessageDTO>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }        

        public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentUsername, string RecipientUsername)
        {
            var messages = await _context.Messages
            .Include(u => u.Sender).ThenInclude(p => p.Photos)
            .Include(u => u.Recipient).ThenInclude(p => p.Photos)
            .Where(r => r.Recipient.UserName == currentUsername 
            && r.Sender.UserName == RecipientUsername || r.Recipient.UserName == RecipientUsername
            && r.Sender.UserName == currentUsername
            ).OrderBy(o => o.Messagesent)
            .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null 
            && m.Recipient.UserName == currentUsername).ToList();

            if(unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = System.DateTime.Now;
                }
                await _context.SaveChangesAsync();
            }

            return Mapper.Map<IEnumerable<MessageDTO>>(messages);

        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}