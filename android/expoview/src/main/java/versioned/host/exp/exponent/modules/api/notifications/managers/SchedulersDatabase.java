package versioned.host.exp.exponent.modules.api.notifications.managers;

import com.raizlabs.android.dbflow.annotation.Database;

@Database(name = SchedulersDatabase.NAME, version = SchedulersDatabase.VERSION)
public class SchedulersDatabase {
  public static final String NAME = "SchedulersDatabase";

  public static final int VERSION = 1;
}
