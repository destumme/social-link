export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              var valid = ['github', 'tokyo', 'catppuccin', 'one', 'serika', 'honey', 'mint', 'lavender'];
              document.documentElement.setAttribute('data-theme', valid.includes(theme) ? theme : 'tokyo');
            } catch (e) {
              document.documentElement.setAttribute('data-theme', 'tokyo');
            }
          })();
        `,
      }}
    />
  );
}
