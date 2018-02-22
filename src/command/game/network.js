import R from 'ramda';

const getBroadcastNetworks = televisionNetworks => {
  let homeTeamNetwork = R.find(R.propEq('home_visitor', 'home'))(
    televisionNetworks
  );
  let visitorTeamNetwork = R.find(R.propEq('home_visitor', 'visitor'))(
    televisionNetworks
  );
  let nationalNetwork = R.find(R.propEq('home_visitor', 'natl'))(
    televisionNetworks
  );
  nationalNetwork = !nationalNetwork ? 'N/A' : nationalNetwork.display_name;
  homeTeamNetwork = !homeTeamNetwork
    ? nationalNetwork
    : homeTeamNetwork.display_name;
  visitorTeamNetwork = !visitorTeamNetwork
    ? nationalNetwork
    : visitorTeamNetwork.display_name;

  return {
    homeTeam: homeTeamNetwork,
    visitorTeam: visitorTeamNetwork,
  };
};

export default getBroadcastNetworks;
