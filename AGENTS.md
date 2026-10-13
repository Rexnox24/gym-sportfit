<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## App architecture
- Keep public content in top-level TanStack routes and private member pages under `_authenticated`; this preserves public previews and enforces member access.
- Read and update member profiles through authenticated server functions and owner-scoped RLS; grant members updates only to their display name to protect membership and payment status.
- Keep all visual tokens and reusable layout styles in `src/styles.css`, and use shared Button variants for actions to maintain consistent branding.
- Store user gym photos as asset pointers; keep the edited logo as an imported image and derive the favicon from it to preserve the official identity.
