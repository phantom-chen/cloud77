using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Cloud77.Abstractions.Utility
{
  public class TimerManager
  {
    private Timer timer;

    public DateTime TimerStarted { get; private set; }

    public bool IsTimerStarted { get; private set; }

    public void StartTimer(Action action1, Action action2)
    {
      execute = action1;
      executeForExpired = action2;
      TimerStarted = DateTime.Now;
      IsTimerStarted = true;
      var reset = new AutoResetEvent(false);
      timer = new Timer(Execute, reset, 1000, 2000);
    }

    public void StopTimer()
    {
      IsTimerStarted = false;
    }

    private Action execute;

    private Action executeForExpired;

    private void Execute(object state)
    {
      if (IsTimerStarted)
      {
        execute();

        var expired = (DateTime.Now - TimerStarted).TotalSeconds > 60;
        if (expired)
        {
          IsTimerStarted = false;
          executeForExpired();
          timer.Dispose();
        }
      }
    }
  }
}
