using AutomationTests.Drivers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutomationTests.StepDefinitions
{
    [Binding]
    public sealed class BrowserStepDefinitions
    {
        private readonly BrowserDriver driver;

        public BrowserStepDefinitions(BrowserDriver driver)
        {
            this.driver = driver;
        }

        [Given(@"Wait (.*) seconds")]
        public void Wait(int seconds)
        {
            Thread.Sleep(seconds * 1000);
        }

        [Given(@"I want to open browser (msedge|chrome)$")]
        public async Task GivenIWantToOpenBrowser(string name)
        {
            await driver.StartAsync(name, false);
            var homeUrl = Environment.GetEnvironmentVariable("WEBURL") ?? "https://cn.bing.com";
            await driver.Page.GotoAsync(homeUrl);
            await driver.Page.SetViewportSizeAsync(1600, 900);
        }

        [Given(@"I close the browser")]
        public async Task CloseBrowserAsync()
        {
            await Task.Delay(10000);
            await driver.CloseAsync();
        }
    }
}
