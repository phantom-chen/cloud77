using Microsoft.Playwright;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpecFlowProject.Drivers
{
    internal interface IBrowserDriver
    {

    }

    public class BrowserDriver : IDisposable
    {
        private IBrowser browser;
        //private IBrowserContext? _context;
        public IBrowser Browser => browser;

        public IPage Page => page;
        private IPage page;

        public async Task CreateAsync(string channel)
        {
            var playwright = await Playwright.CreateAsync();
            browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions()
            {
                Channel = channel,
                Headless = false
            });
            var options = new BrowserNewContextOptions();
            var context = await browser.NewContextAsync(options);
            page = await context.NewPageAsync();
        }

        public async Task CloseAsync()
        {
            await page.CloseAsync();
            await browser.CloseAsync();
        }

        public void Dispose()
        {
            browser?.CloseAsync().Wait();
        }
    } 
}
