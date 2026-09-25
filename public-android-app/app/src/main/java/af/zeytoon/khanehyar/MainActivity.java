package af.zeytoon.khanehyar;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
  private static final int PICK_FILE = 2101;
  private static final int SAVE_FILE = 2102;
  private WebView webView;
  private ValueCallback<Uri[]> fileCallback;
  private String pendingText = null;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().setStatusBarColor(Color.rgb(247,247,242));
    getWindow().setNavigationBarColor(Color.rgb(247,247,242));
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    webView = new WebView(this);
    ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
      Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
      v.setPadding(0, bars.top, 0, bars.bottom);
      return insets;
    });

    WebSettings s = webView.getSettings();
    s.setJavaScriptEnabled(true);
    s.setDomStorageEnabled(true);
    s.setDatabaseEnabled(true);
    s.setAllowFileAccess(true);
    s.setAllowContentAccess(true);
    s.setLoadWithOverviewMode(true);
    s.setUseWideViewPort(true);
    s.setTextZoom(100);

    webView.setWebViewClient(new WebViewClient());
    webView.addJavascriptInterface(new Bridge(), "Zeytoon");
    webView.setWebChromeClient(new WebChromeClient() {
      @Override
      public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
        if (fileCallback != null) fileCallback.onReceiveValue(null);
        fileCallback = callback;
        try {
          Intent i = params.createIntent();
          startActivityForResult(i, PICK_FILE);
          return true;
        } catch (Exception e) {
          fileCallback = null;
          return false;
        }
      }
    });

    setContentView(webView);
    webView.loadUrl("file:///android_asset/index.html");
  }

  public class Bridge {
    @JavascriptInterface
    public void saveText(String filename, String content) {
      runOnUiThread(() -> {
        pendingText = content;
        Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("application/json");
        i.putExtra(Intent.EXTRA_TITLE, filename);
        startActivityForResult(i, SAVE_FILE);
      });
    }

    @JavascriptInterface
    public String appVersion() { return "1.0.0"; }

    @JavascriptInterface
    public void toast(String message) {
      runOnUiThread(() -> Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show());
    }
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == PICK_FILE && fileCallback != null) {
      Uri[] result = null;
      if (resultCode == RESULT_OK && data != null && data.getData() != null) result = new Uri[]{data.getData()};
      fileCallback.onReceiveValue(result);
      fileCallback = null;
      return;
    }
    if (requestCode == SAVE_FILE && resultCode == RESULT_OK && data != null && data.getData() != null && pendingText != null) {
      try (OutputStream out = getContentResolver().openOutputStream(data.getData())) {
        if (out != null) out.write(pendingText.getBytes(StandardCharsets.UTF_8));
        Toast.makeText(this, "پشتیبان ذخیره شد", Toast.LENGTH_SHORT).show();
      } catch (Exception e) {
        Toast.makeText(this, "ذخیره پشتیبان ناموفق بود", Toast.LENGTH_SHORT).show();
      }
      pendingText = null;
    }
  }

  @Override
  public void onBackPressed() {
    if (webView != null && webView.canGoBack()) webView.goBack();
    else super.onBackPressed();
  }

  @Override
  protected void onDestroy() {
    if (webView != null) { webView.destroy(); webView = null; }
    super.onDestroy();
  }
}
