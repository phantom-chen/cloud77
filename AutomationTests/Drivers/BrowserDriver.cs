using Microsoft.Playwright;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutomationTests.Drivers
{
    public class BrowserDriver: IDisposable
    {
        private IBrowser browser;
        private IBrowserContext context;
        private IPage page;
        private string endpointURL;

        public IBrowser Browser => browser;

        public IPage Page => page;

        public async Task StartAsync(string channel, bool headless = false)
        {
            var playwright = await Playwright.CreateAsync();
            browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions()
            {
                Channel = channel,
                Headless = headless
            });
            var options = new BrowserNewContextOptions();
            options.Permissions = new[] { "clipboard-read", "clipboard-write" };
            context = await browser.NewContextAsync(options);
            page = await context.NewPageAsync();
        }

        public async Task StartAsync(string endpointURL)
        {
            this.endpointURL = endpointURL;
            var playwright = await Playwright.CreateAsync();
            var browser = await playwright.Chromium.ConnectOverCDPAsync(this.endpointURL);
            page = await browser.Contexts[0].NewPageAsync();
        }

        public async Task CloseAsync()
        {
            if (string.IsNullOrEmpty(endpointURL))
            {
                await context.CloseAsync();
                await browser.CloseAsync();
            }
            else
            {
                await page.CloseAsync();
            }
        }

        public void Dispose()
        {
            if (string.IsNullOrEmpty(endpointURL))
            {
                if (context != null)
                {
                    context.CloseAsync().Wait();
                }
                if (browser != null)
                {
                    browser?.CloseAsync().Wait();
                }
            }
        }
    }
}
