## Pages

/proposals 
  - data-test="proposal-button-submit-votes"
  - data-test="proposal-button-show-details"
  - data-test="proposal-button-execute"

/proposal/:id
  - data-test="proposal-button-extra-menu"
  - data-test="proposal-link-copy-url"
  - data-test="proposal-link-view-block-explorer"

/proposal/create 
  - data-test="create-proposal-button-back-bottom”
  - data-test="create-proposal-button-submit"
  - data-test="create-proposal-button-preview"
  - data-test="create-proposal-button-back-top"
  - data-test="create-proposal-button-close-other-list"
  - data-test="create-proposal-button-close-other-config"
  - data-test="create-proposal-input-url-ipfs"
  - data-test="create-proposal-input-url-discussion"



/profile/me OR /profile/:address
  - data-test="profile-button-redelegate"
  - data-test="profile-button-voting-history"
  - data-test="profile-button-submitted-proposals"

/settings
  - data-test="settings-button-return-to-list"
  - data-test="settings-button-custom-rpc"
  - data-test="settings-button-submit"
  - data-test="settings-input-url-rpc"


/delegate
  - data-test="delegate-button-power-use-my-address"
  - data-test="delegate-button-power-submit"
  - data-test="delegate-button-zero-use-my-address"
  - data-test="delegate-button-zero-submit"
  - data-test="delegate-power-input-address"
  - data-test="delegate-zero-input-address"




## Components

Sidebar    
  - data-test="sidebar-button-create-proposal"
  - data-test="sidebar-link-lists"
  - data-test="sidebar-link-proposals"
  - data-test="sidebar-link-governance"
  - data-test="sidebar-link-protocol"
  - data-test="sidebar-link-my-profile"
  - data-test="sidebar-link-delegate"
  - data-test="sidebar-button-disconnect"

Header
  - data-test="header-button-toggle-sidebar"

Modal Web3 Connect
  - data-test="modal-web3-button-connect-wallet"
  - :data-test="`modal-web3-connect-button-metamask`"
  - data-test="modal-web3-connect-button-close"

Modal 
  - data-test="modal-button-close"

Reset Alert
  - data-test="reset-alert-button-view-proposal"

