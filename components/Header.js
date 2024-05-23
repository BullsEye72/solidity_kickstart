import { MenuMenu, MenuItem, Menu } from "semantic-ui-react";
import Link from "next/link";

const Header = () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <MenuItem>
        <Link href="/">
          <a>CrowdCoin</a>
        </Link>
      </MenuItem>

      <Menu.Menu position="right">
        <MenuItem>
          <Link href="/">
            <a>Campaigns</a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/campaigns/new">
            <a>+</a>
          </Link>
        </MenuItem>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
